const profileInfo = (user)=>{
    const fullname = document.getElementById("fullname")
    const email = document.getElementById("email")
    const picture = document.getElementById("picture")
    console.log(user)
    fullname.innerHTML = user.fullname
    email.innerHTML = user.email
    picture.src = user.picture ? "/"+user.picture : "../images/avt.png"
}

const uploadProfilePic = async (e)=>{
    try {
        const session = await getSession()
        const input = e.target
        const file = input.files[0]
        const formdata = new FormData()
        formdata.append('picture', file)

        const options = {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        }

        const res = await axios.post('/api/upload-profile-picture', formdata, options)
        localStorage.setItem("auth", res.data.token)
        window.location = location.href
    }
    catch(err)
    {
        console.log(err.response.data)
    }
}

const getMb = (byte)=>{
    const kb = byte / 1000
    const mb = kb / 1000
    return mb.toFixed(1)
}

const fetchStorage = async (token)=>{
    try {
        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const {data} = await axios.get('/api/storage', options)
        const storage = document.getElementById("storage")
        const storagePercentage = document.getElementById("storage-percentage")
        const storagePercentageBox = document.getElementById("storage-percentage-box")

        const p = (data.usedStorage*100)/data.storage
        storage.innerHTML = `${getMb(data.usedStorage)}Mb / ${getMb(data.storage)}Mb`
        storagePercentage.style.width = p+"%"

        if(p > 90)
        {
            storagePercentage.classList.remove("bg-blue-600")
            storagePercentageBox.classList.remove("bg-blue-100")

            storagePercentage.classList.add("bg-rose-600")
            storagePercentageBox.classList.add("bg-rose-100")
        }

    }
    catch(err)
    {
        console.log(err)
        console.log(err.response.data.message)
    }
}