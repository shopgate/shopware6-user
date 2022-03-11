
module.exports = async function (context, input) {
  if (input.success && input.message === "query error") {
    throw new Error("Du wurdest ausgeloggt")
  } else {

    return {
      id: input.id,
      mail: input.mail,
      firstName: input.firstName,
      lastName: input.lastName,
      gender: null,
      birthday: input.birthday,
      phone: null,
      customerGroups: input.customerGroups,
      addresses: []
    }
  }
}