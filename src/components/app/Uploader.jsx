"use client";

import { useState } from "react";
import { S3 } from "aws-sdk";

const Uploader = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    if (e.target.files.length === 0) {
      setError("لطفا اول تصویر مورد نظر رو انتخاب نمایید !");
      return;
    }

    try {
      setLoading(true);

      const s3 = new S3({
        accessKeyId: process.env.NEXT_PUBLIC_LIARA_ACCESS_KEY,
        secretAccessKey: process.env.NEXT_PUBLIC_LIARA_SECRET_KEY,
        endpoint: process.env.NEXT_PUBLIC_LIARA_ENDPOINT,
      });

      const file = e.target.files[0];

      const params = {
        Bucket: process.env.NEXT_PUBLIC_LIARA_BUCKET_NAME,
        Key: file.name,
        Body: file,
      };

      await s3.upload(params).promise();

      const permanentSignedUrl = s3.getSignedUrl("getObject", {
        Bucket: process.env.NEXT_PUBLIC_LIARA_BUCKET_NAME,
        Key: file.name,
        Expires: 31536000, // 1 year expiration
      });

      onUpload(permanentSignedUrl);
    } catch (error) {
      setError("هنگام آپلود خطایی رخ داد !");
      console.log("error while uploading image =>", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 lg:flex-row">
      <input
        id="uploader"
        className="hidden"
        type="file"
        multiple={false}
        accept="image/*"
        onChange={handleUpload}
      />
      <span
        className="btn w-full lg:w-fit"
        onClick={() => document.getElementById("uploader").click()}
        disabled={loading}
      >
        آپلود تصویر
      </span>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Uploader;
