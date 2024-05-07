import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export default async function deleteImage(req, res) {
  if (req.method !== "DELETE") {
    res.status(405).send({ message: "Only DELETE request is allowed." });
    return;
  }

  try {
    const client = new S3Client({
      // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    const { key } = req.body;
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const response = await client.send(deleteCommand);

    res.status(200).json(response);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}
