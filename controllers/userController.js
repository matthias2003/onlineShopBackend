const { getUser, updateUser} = require("services/userService");
const { put, list } = require("@vercel/blob");

exports.getUser = async (req,res) => {
    const { id } = req.body;

    try {
        const data = await getUser(id);

        const resData = {
            email: data.email,
            name: data.name,
            surname: data.surname,
            profilePicture: data.profilePicture
        };
        return res.status(200).json(resData);
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while fetching user data", error });
    }
}

exports.updateUser =  async (req,res) => {
    const email = req.body.email;
    const userData = JSON.parse(req.body.userData);

    try {
        if (req.file) {
            const { buffer, originalname } = req.file;
            const blobName = `${Date.now()}-${originalname}`;
            const fileStream = Buffer.from(buffer).toString("utf-8");
            const { url } = await put(`avatars/${blobName}`, fileStream, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN });

            // const { url } = await put(`avatars/${blobName}`, buffer, {
            //     access: "public",
            //     token: process.env.BLOB_READ_WRITE_TOKEN
            // });

            const data = await list({ prefix: 'avatars/' });

            const matchingBlob = data.blobs.find(blob => blob.pathname.endsWith(blobName));

            if (matchingBlob) {
                await updateUser(email, matchingBlob.url, userData);
            } else {
                return res.status(500).json({ message: "Failed to update user profile picture URL" });
            }
        } else {
            await updateUser(email,"",userData);
        } return res.status(200).json({ status: true });
    } catch (err) {
        return res.status(500).json({ status:false ,message: "Failed to update user" });
    }
}