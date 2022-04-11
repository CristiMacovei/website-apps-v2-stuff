import React, {useRef, useState} from 'react'

const PopupSettings = (props) => {
  const widthError = useRef()
  const widthInput = useRef()

  const heightError = useRef()
  const heightInput = useRef()

  const [isPopupEnabled, setIsPopupEnabled] = useState(false)

  const togglePopup = () => {
    setIsPopupEnabled(!isPopupEnabled)
  }

  const verifyWidth = (evt) => {
    const value = evt.target.value

    if (value <= 600) {
      widthError.current.classList.add('hidden')
      widthInput.current.classList.remove('border-2')
    }
    else {
      widthError.current.classList.remove('hidden')
      widthInput.current.classList.add('border-2')
    }
  }

  const verifyHeight = (evt) => {
    const value = evt.target.value

    if (value <= 600) {
      heightError.current.classList.add('hidden')
      heightInput.current.classList.remove('border-2')
    }
    else {
      heightError.current.classList.remove('hidden')
      heightInput.current.classList.add('border-2')
    }
  }

  return (
    <>
      <div className={props.hidden ? 'hidden ' : '' + 'mt-3 h-1/2'}>
        <div className="flex align-middle pl-1 mb-2">
          <input onChange={togglePopup} className='mt-1.5 mr-1' type="checkbox" name="popup-enabled" id="extension-popup-enabled-input" />
          <label htmlFor="popup-enabled"> Enable Popup </label>

          <input disabled={!isPopupEnabled} className='ml-3 mt-1.5 mr-1' type="checkbox" name="inject-html-enabled" id='extension-popup-inject-html-enabled' />
          <label htmlFor="inject-html-enabled">{ 'Inject HTML (only if you know what you\'re doing)' }</label>
        </div>
        
        <textarea disabled={!isPopupEnabled} className='block border-red-500 bg-gray-200 rounded-md w-full h-3/4 p-3 outline-none' defaultValue='' type='text' name='popup' id='extension-popup-input' placeholder='Popup Text' />
      
        <div className='pl-2 mt-3 flex'>
          <div className='w-1/3'>
            <div className='w-fit flex text-center align-middle'>
              <span className='block h-fit my-auto mr-2' htmlFor="extension-popup-width">Width: </span>
              <input ref={widthInput} onChange={verifyWidth} disabled={!isPopupEnabled} className='outline-none block border-red-500 bg-gray-200 rounded-md w-1/3 text-center h-10' type="number" name="extension-popup-width" id="extension-popup-width-input" defaultValue='400' placeholder='400'/>
            </div>

            <label ref={widthError} className='text-red-500 hidden' htmlFor="extension-popup-width">Maximum width is 600px</label>
          </div>

          <div className='w-1/3'>
            <div className='w-fit flex text-center align-middle'>
              <span className='block h-fit my-auto mr-2' htmlFor="extension-popup-height">Height: </span>
              <input ref={heightInput} onChange={verifyHeight} disabled={!isPopupEnabled} className='outline-none block border-red-500 bg-gray-200 rounded-md w-1/3 text-center h-10' type="number" name="extension-popup-height" id="extension-popup-height-input" defaultValue='400' placeholder='400'/>
            </div>

            <label ref={heightError} className='text-red-500 hidden' htmlFor="extension-popup-height">Maximum height is 600px</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default PopupSettings