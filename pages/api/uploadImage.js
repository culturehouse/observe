import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export default async function uploadImage(req, res) {
  if (req.method !== "PUT") {
    res.status(405).send({ message: "Only PUT request is allowed." });
    return;
  }

  try {
    const client = new S3Client({
      // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    const { key, file } = req.body;

    const uploadCommand = new PutObjectCommand({
      ACL: "public-read",
      Body: new Buffer.from(
        file.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
      Bucket: process.env.AWS_BUCKET_NAME,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
      Key: key,
    });
    const response = await client.send(uploadCommand);

    res.status(200).json(response);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}
