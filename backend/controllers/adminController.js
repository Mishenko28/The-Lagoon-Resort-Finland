const { Admin, Roles } = require('../models/adminModel')
const Archive = require('../models/archiveModel')
const { ActivityLog, Actions } = require('../models/activityLogModel')
const InviteLink = require('../models/inviteLinkModel')
const sendMail = require('../Utility/nodeMailer')


const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const createToken = (id) => {
    return jwt.sign({ id }, process.env.PASSWORD, { expiresIn: '1d' })
}




// LOGIN
let attempts = {}

const loginAdmin = async (req, res) => {
    const { email, password } = await req.body
    const ip = await req.ip

    if (!attempts[ip]) attempts[ip] = 8
    else attempts[ip]--

    try {
        const admin = await Admin.findOne({ email })

        if (!admin) {
            const deletedAdmin = await Archive.findOne({ type: "admin", "data.email": email })

            if (deletedAdmin) {
                if (attempts[ip] <= 3) throw Error(`Warning you have only ${attempts[ip] - 1} attempts left`)
                throw Error("This admin account has been deleted")
            }
        }

        if (!admin) {
            if (attempts[ip] <= 3) throw Error(`Warning you have only ${attempts[ip] - 1} attempts left`)
            throw Error("Admin not Found")
        }

        const match = await bcrypt.compare(password, admin.password)

        if (!match) {
            if (attempts[ip] <= 3) throw Error(`Warning you have only ${attempts[ip] - 1} attempts left`)
            throw Error("Incorrect password")
        }

        delete attempts[ip]
        const token = createToken(admin._id)

        // activity log
        await ActivityLog.create({ adminEmail: email, action: [Actions.LOGGED_IN, Actions.ADMIN], activity: "Logged in." })

        res.status(200).json({ email, token, profile: admin.img, role: admin.role })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ADD NEW ADMIN
const addNewAdmin = async (req, res) => {
    const { email, password, img, role, name, sex, age, contact, adminEmail } = await req.body

    try {
        const match = await Admin.findOne({ email })

        if (match) throw Error("Admin already exist")
        if (!validator.isEmail(email)) throw Error("email is not valid")
        if (!validator.isStrongPassword(password, { minUppercase: 0, minNumbers: 0, minSymbols: 0 })) throw Error("password must atleast 8 characters")


        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const admin = await Admin.create({ email, password: hash, img, role, personalData: { name, sex, age, contact } })

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.ADMIN, Actions.CREATED], activity: `Added a new admin with the email of "${email}"` })

        res.status(200).json({ admin })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// DELETE ADMIN
const deleteAdmin = async (req, res) => {
    const { _id, password, adminEmail } = await req.body

    try {
        const admin = await Admin.findOne({ email: adminEmail })
        const match = await bcrypt.compare(password, admin.password)

        if (!match) throw Error("Incorrect password")

        const deletedAdmin = await Admin.findOneAndDelete({ _id })

        // archive
        if (admin) {
            await Archive.create({ adminEmail, type: "admin", data: deletedAdmin })
        }

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.ADMIN, Actions.DELETED], activity: `Deleted an admin with the email of "${deletedAdmin.email}"` })

        res.status(200).json({ admin: deletedAdmin })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// RESTORE ADMIN
const restoreAdmin = async (req, res) => {
    const { _id, data, adminEmail } = await req.body

    try {
        const admin = await Admin.create({ ...data })

        // archive
        if (admin) {
            await Archive.findOneAndDelete({ _id })
        }

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.ADMIN, Actions.RESTORED], activity: `Restored an admin with the email of "${admin.email}"` })

        res.status(200).json({ admin })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// UPDATE ADMIN PROFILE
const updateAdmin = async (req, res) => {
    const { _id, email, role, img, name, sex, age, contact, adminEmail } = await req.body
    let editedParts = []

    try {
        const exist = await Admin.findOne({ _id: { $ne: _id }, email })
        if (exist) throw Error("Admin already exist")

        const oldAdmin = await Admin.findOne({ _id })

        const admin = await Admin.findOneAndUpdate({ _id }, { email, img, role, personalData: { name, sex, age, contact } }, { new: true })

        // activity log
        JSON.stringify(oldAdmin.role) !== JSON.stringify(role) && editedParts.push("role")
        oldAdmin.img !== img && editedParts.push("image")
        oldAdmin.email !== email && editedParts.push("email")
        oldAdmin.personalData.name !== name && editedParts.push("name")
        oldAdmin.personalData.sex !== sex && editedParts.push("sex")
        oldAdmin.personalData.age !== age && editedParts.push("age")
        oldAdmin.personalData.contact !== contact && editedParts.push("contact")

        if (editedParts.length > 0) {
            await ActivityLog.create({
                adminEmail,
                action: [Actions.ADMIN, Actions.UPDATED],
                activity: `Changed information of admin ${oldAdmin.email}. ${editedParts.map(part => {
                    switch (part) {
                        case "role":
                            return ` changed role from "${oldAdmin.role.map(a => a)}" to "${role.map(a => a)}"`
                        case "image":
                            return ` changed Profile Picture`
                        case "email":
                            return ` changed email from "${oldAdmin.email}" to "${email}"`
                        case "name":
                            return ` changed name from "${oldAdmin.personalData.name}" to "${name}"`
                        case "sex":
                            return ` changed sex from "${oldAdmin.personalData.sex}" to "${sex}"`
                        case "age":
                            return ` changed age from "${oldAdmin.personalData.age}" to "${age}"`
                        case "contact":
                            return ` changed contact from "${oldAdmin.personalData.contact}" to "${contact}"`
                    }
                })} `
            })
        }

        res.status(200).json({ admin })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// CHANGE PASSWORD
const updatePassword = async (req, res) => {
    const { password, adminEmail } = await req.body
    const email = adminEmail

    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const admin = await Admin.findOneAndUpdate({ email }, { email, password: hash }, { new: true })

        // activity log
        await ActivityLog.create({ adminEmail, action: [Actions.ADMIN, Actions.UPDATED], activity: `Changed password.` })

        res.status(200).json({ admin })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL ADMIN
const getAllAdmin = async (_, res) => {
    try {
        const admins = await Admin.find({})

        res.status(200).json({ admins })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL ROLES
const getAllRoles = async (_, res) => {
    try {
        res.status(200).json({ Roles })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ROLE BY EMAIL
const getRole = async (req, res) => {
    const { email } = await req.query

    try {
        const role = await Admin.findOne({ email }).select('role')

        res.status(200).json({ role: role.role })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET SINGLE ADMIN
const getSingleAdmin = async (req, res) => {
    const { email } = await req.query

    try {
        const admin = await Admin.findOne({ email })

        res.status(200).json({ admin })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// GET ALL INVITE LINK
const getAllInviteLink = async (_, res) => {
    try {
        const invites = await InviteLink.find({})

        res.status(200).json({ invites })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// CREATE INVITE LINK
const createInviteLink = async (req, res) => {
    const { email, role } = await req.body

    try {
        const adminExist = await Admin.findOne({ email })
        if (adminExist) throw Error("This email is already an Admin")

        const exist = await InviteLink.findOne({ email })
        if (exist) throw Error("There are currently an active invite link for this email")

        const token = createToken(email)
        const link = process.env.WEBSITE_URL + '/admin-invite?token=' + token
        const invite = await InviteLink.create({ email, role, link })

        sendMail({
            to: email,
            subject: "Hello from The Lagoon Resort Finland Inc.!",
            html: `<h2>You have been invited to be an admin of The Lagoon Resort Finland Inc.<h2>
                    <h3>Click the link to accept the invitation.<h3>
                    <a href="${link}">Click here</a>`
        }, (error) => {
            if (error) {
                throw Error(error)
            }
        })

        res.status(200).json({ invite })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// RESEND INVITE LINK
const resendInviteLink = async (req, res) => {
    const { newEmail, oldEmail } = await req.body

    try {
        const adminExist = await Admin.findOne({ email: oldEmail })
        if (adminExist) throw Error("This email is already an Admin")

        const oldInvite = await InviteLink.findOne({ email: oldEmail })
        if (!oldInvite) throw Error("No invite link found")

        await InviteLink.findOneAndDelete({ email: oldEmail })
        const invite = await InviteLink.create({ email: newEmail, role: oldInvite.role, link: oldInvite.link })

        sendMail({
            to: newEmail,
            subject: "Hello from The Lagoon Resort Finland Inc.!",
            html: `<h2>You have been invited to be an admin of The Lagoon Resort Finland Inc.<h2>
                    <h3>Click the link to accept the invitation.<h3>
                    <a href="${invite.link}">Click here</a>`
        }, (error) => {
            if (error) {
                throw Error(error)
            }
        })

        res.status(200).json({ invite, _id: oldInvite._id })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// VERIFY INVITE LINK
const verifyInviteLink = async (req, res) => {
    const { token } = await req.body

    try {
        const decoded = jwt.verify(token, process.env.PASSWORD)
        const invite = await InviteLink.findOne({ email: decoded.id })

        if (!invite) throw Error("Invalid Link")

        res.status(200).json({ invite })
    } catch (error) {
        res.status(400).json({ error: "Invalid Link" })
    }
}

// DELETE INVITE LINK
const deleteInviteLink = async (req, res) => {
    const { _id } = await req.body

    try {
        const invite = await InviteLink.findOneAndDelete({ _id })

        res.status(200).json({ invite })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// ADD ADMIN USING LINK
const addNewAdminLink = async (req, res) => {
    const { email, password, img, role, name, sex, age, contact, token } = await req.body

    try {
        const decoded = jwt.verify(token, process.env.PASSWORD)
        if (decoded.id !== email) throw Error("Invalid Link")

        if (!validator.isStrongPassword(password, { minUppercase: 0, minNumbers: 0, minSymbols: 0 })) throw Error("password must atleast 8 characters")
        await InviteLink.findOneAndDelete({ email })

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const admin = await Admin.create({ email, password: hash, img, role, personalData: { name, sex, age, contact } })

        // activity log
        await ActivityLog.create({ adminEmail: email, action: [Actions.ADMIN, Actions.CREATED], activity: `Added a new admin with the email of "${email}"` })

        res.status(200).json({ admin })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


module.exports = {
    loginAdmin,
    addNewAdmin,
    deleteAdmin,
    restoreAdmin,
    updateAdmin,
    getAllAdmin,
    updatePassword,
    getAllRoles,
    getRole,
    getSingleAdmin,
    createInviteLink,
    getAllInviteLink,
    verifyInviteLink,
    deleteInviteLink,
    resendInviteLink,
    addNewAdminLink
}