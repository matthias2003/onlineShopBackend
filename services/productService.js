const getData = async () => {
    return Products.find().sort({_id: -1}).limit(4);
}

const getDataByName = async (name) => {
    const regex = new RegExp(name, 'i')
    return Products.find({name: {$regex: regex}})
}

const getDataById = async (id) => {
    return Products.find({_id:id});
}

const getBestsellers = async () => {
    return Products.find().sort({sold:-1}).limit(4);
}

const getDataGender = async (gender) => {
    return Products.find({gender:gender});
}

module.exports = {
    getData,
    getBestsellers,
    getDataGender,
    getDataByName,
    getDataById,
};