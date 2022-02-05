// const nosondb = require("@tush-tr/nosondb")
const nosondb = require("./index")
const nodb = new nosondb("db.json")


const test = async () => {
    // creating a new object
    await nodb.create({ name: "Product1", price: 12 })

    // Update one object
    // await nodb.update("800dc06c",{name: "Keyboard"})

    // Delete one record
    // await nodb.delete("800dc06c")
    // find all objects
    const allData = await nodb.getAll();
    // get one specific data by id
    // const specificData = await nodb.getOne("800dc06c")
    // get data by filters
    const filteredData = await nodb.getOneBy({ name: 'Product1' })

    console.log(`nodb.getAll() : ${JSON.stringify(allData)}`)
    // console.log(`nodb.getOne:  ${JSON.stringify(specificData)}`)
    console.log(`nodb.getOneBy: ${JSON.stringify(filteredData)}`)
    const filterData = await nodb.getAllBy({ name: 'Product1' })
    console.log(filterData)
}
test();