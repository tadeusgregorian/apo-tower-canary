import {Storage} from '../firebaseInstance';

const getPdfMetaData = (name) => ({contentType: "application/pdf", contentDisposition : "inline; filename=" + name})
const getSimpleMetaData = (name) => ({contentType: "application/text", contentDisposition : "attachment; filename=" + name})

const getMedaData = (fileName) => (
  fileName.slice(-4) === ".pdf" ? getPdfMetaData(fileName) : getSimpleMetaData(fileName)
)

export const uploadQmFile = (file, guid, fileName) => {
  const ref = Storage.ref().child(`${window.accountID}/qm/${guid}/${fileName}`)
  return ref.putString(file, 'base64', getMedaData(fileName))
}
