import React from 'react'
import './styles.css'

export default ({file, tryToDownloadFile, tryToOpenPDF}) => {
  const fileIsViewable = file.name.substr(-4)===".pdf";
  //const uniqueKey = file.name + file.uploadTime + file.size
  return(
    <fb className="attachmentBarMain">
      <fb className="iconButton" onClick={() => tryToDownloadFile(file)}>
        <icon className="icon-download" />
      </fb>
      { fileIsViewable &&
        <fb className="iconButton" onClick={() => tryToOpenPDF(file)}>
          <icon className="icon-eye" />
        </fb> }
      <fb className="name">{file.name}</fb>
    </fb>
  )
}
