import { useState } from 'react'

const useConvertBase64 = (initialValue) => {
    const [base64, setBase64] = useState(initialValue)

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                setBase64(reader.result)
                resolve(reader.result)
            }
            reader.onerror = (error) => {
                reject(error)
            }
        })
    }

    return [base64, convertToBase64]
}

export default useConvertBase64