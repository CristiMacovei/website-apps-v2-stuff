import React, {useRef, useState} from 'react'
import JSZip from 'jszip'
import saveAs from 'file-saver'

import PopupSettings from '../../components/apps/extension_maker/PopupSettings.jsx'

const ExtensionMaker = () => {
  const titleError = useRef()
  const titleInput = useRef()

  const descError = useRef()
  const descInput = useRef()

  const [showPopupSettings, setShowPopupSettings] = useState(false)

  const verifyTitle = (evt) => {
    if (evt.target.value.length > 45) {
      titleError.current.classList.remove('hidden')
      titleError.current.innerHTML = 'Title must be 45 characters or less'
      
      titleInput.current.classList.add('border-2')
    }
    else {
      titleError.current.classList.add('hidden')
      titleInput.current.classList.remove('border-2')      
    }
  }

  const verifyDescription = (evt) => {
    if (evt.target.value.length > 128) {
      descError.current.classList.remove('hidden')
      descError.current.innerHTML = 'Short description must be 128 characters or less'
      
      descInput.current.classList.add('border-2')
    }
    else {
      descError.current.classList.add('hidden')
      descInput.current.classList.remove('border-2')      
    }
  }

  const togglePopupSettings = (evt) => {
    evt.preventDefault()

    setShowPopupSettings(!showPopupSettings)
  }

  const submitForm = (evt) => {
    evt.preventDefault()

    const data = {
      title: document.querySelector('#extension-title-input')?.value,
      desc: document.querySelector('#extension-desc-input')?.value,
      popupEnabled: document.querySelector('#extension-popup-enabled-input')?.checked,
      popupText: document.querySelector('#extension-popup-input')?.value,
      popupWidth: document.querySelector('#extension-popup-width-input')?.value,
      popupHeight: document.querySelector('#extension-popup-height-input')?.value,
      popupInjectHTML: document.querySelector('#extension-popup-inject-html-enabled')?.checked,
      image: document.querySelector('#extension-image-input')?.files[0],
    }

    const zip = new JSZip()

    let manifestData = {
      manifest_version: 3,
      name: data.title,
      description: data.desc,
      version: '1.0.0',
      author: 'Cristi Macovei - Auto Generated'
    }

    if (typeof data.image !== 'undefined' && data.image !== null) {
      zip.folder('assets').file('logo.png', data.image)

      manifestData.icons = {
        '16': 'assets/logo.png',
        '48': 'assets/logo.png',
        '128': 'assets/logo.png'
      }
    }

    if (data.popupEnabled) {
      manifestData['action'] = {
        default_popup: 'popup/index.html'
      }
      
      const popupFolder = zip.folder('popup')
      popupFolder.file('index.html', `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>${data.title}</title>

            <link rel="stylesheet" href="styles.css">
          </head>
          <body>
            ${data.popupInjectHTML ? data.popupText : `<p class="center">${data.popupText}</p>`}
          </body>
        </html>
      `)

      popupFolder.file('styles.css', `
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        body {
          width: ${data.popupWidth}px;
          height: ${data.popupHeight}px;
        }

        .center {
          width: fit-content;
          margin: auto;
          margin-top: 10%;
          font-size: 1rem;
        }
      `)
    }
    
    zip.file('manifest.json', JSON.stringify(manifestData))

    zip.generateAsync({type: 'blob'}).
    then(file => {
      saveAs(file, 'extension.zip')
    })
  }

  return (
    <div className='block w-screen h-screen'>
      <form onSubmit={submitForm} className='w-8/12 pt-10 mx-auto h-5/6' id='extension-maker-form'>
        <div className=''>
          <input className='block w-full p-3 bg-gray-200 border-red-500 rounded-md outline-none' defaultValue='' ref={titleInput} onChange={verifyTitle} type='text' name='title' id='extension-title-input' placeholder='Title (< 45 characters)'/>
          <label className='hidden pl-2 text-red-500' htmlFor='name' ref={titleError}></label>
        </div>

        <div className='mt-5 h-1/5'>
          <textarea className='block w-full h-full p-3 bg-gray-200 border-red-500 rounded-md outline-none' defaultValue='' ref={descInput} onChange={verifyDescription} type='text' name='description' id='extension-desc-input' placeholder='Description (< 128 characters)' />
          <label className='hidden pl-2 text-red-500' htmlFor='name' ref={descError}></label>
        </div>

        <div className='mt-5'>
          <button onClick={togglePopupSettings}>
            {
              showPopupSettings ? 
              (
                <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-6 h-6 pb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              ) :
              (
                <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-6 h-6 pb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              )

            }
            Popup Settings
          </button>
        </div>

        <PopupSettings hidden={!showPopupSettings} />

        <div className='mt-5'>
          <label htmlFor="extension-image">Upload Image</label>
          <br />

          <input className='mt-3' type="file" name="extension-image" id="extension-image-input" accept='image/png' multiple={false}/>
        </div>

        <div className='mt-5'>
          <button className='block w-full p-3 text-white bg-blue-500 rounded-md outline-none' type='submit'>Create Extension</button>
        </div>
      </form>
    </div>
  )
}

export default ExtensionMaker