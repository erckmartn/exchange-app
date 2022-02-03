
	
	const currencyOneD= document.querySelector('[data-js="currency-one"]')
	const currencyTwoD = document.querySelector('[data-js="currency-two"]')
	const currenciesD = document.querySelector('[data-js="currencies-container"]')
	const convertedValueD = document.querySelector('[data-js="converted-value"]')
	const precisionValueD = document.querySelector('[data-js="conversion-precision"]')
	const currencyTimesD = document.querySelector('[data-js="currency-one-times"]')


	//let internalExchangeRate = {}
	
		const showAlert = err => {
		const div = document.createElement('div')
		const button = document.createElement('button')
		
		div.textContent = err.message
		
		div.classList.add('alert',   'alert-warning','alert-dismissible', 'fade', 'show')
		div.setAttribute('role','alert')
		button.classList.add('btn-close')
		
		div.appendChild(button)
		button.setAttribute('type','button')
		button.setAttribute('aria-label','close')
		
		currenciesD.insertAdjacentElement('afterend', div)		
		
		const removeAlert = () => div.remove()		
		button.addEventListener('click', removeAlert)
		
		
	}	 
	
	const state = (() => {
		
		let exchangeRate = {}
		
		return {
			
			getExchangeRate: () => exchangeRate,
			setExchangeRate: newExchangeRate => {
				
				if(!newExchangeRate.conversion_rates) {
					
					showAlert({message:'El objeto necesita de una propiedad conversion_rates'})
					return
				}				
				exchangeRate = newExchangeRate			
				return exchangeRate
			}			
			
		}
	})()
	


//state.setExchangeRate({conversion_rates:{'CLP': 817.43}}) 
// tmDV9V4bA8TaFFM


// Your API Key: b8be350b9653c107d997c6ef
// Example Request: https://v6.exchangerate-api.com/v6/b8be350b9653c107d997c6ef/latest/USD
	
	const APIkey = 'b8be350b9653c107d997c6ef'
	const getUrl = currency =>
		`https://v6.exchangerate-api.com/v6/${APIkey}/latest/${currency}`
	const getErrormessage = errorType => ({
		'unsupported-code':'La moneda no existe en nuestra base de datos',
		'malformed:request':'La escructura de solicitud de informacion no es la correcta',
		'invalid-key':'Tu clave para obtener inforamcion es invalida',
		'quota-reached':'Haz alcanzado tu numero maxio de solicitudes permitidas'
	})[errorType] || 'No fue posible obtener esa informacion.'
	
	
	const fetchExchangeRate = async url => {


	try {
		const response = await fetch(url)
		
		
		
		/*if(!response.ok){
			throw new Error('Su conexion fallo. No fue posible obtener esa informacion.')
		}  */
			
		const exchangeRateData = await  response.json() 
		
		//error-type: "unsupported-code" ******
				
		 if (exchangeRateData.result === 'error') {
			const errorMessage = getErrormessage(exchangeRateData['error-type'])			
			throw new Error(errorMessage)
			
		}	
		return state.setExchangeRate(exchangeRateData)
	}

	catch (err) {
			showAlert(err)
		}
	}
		
	const getOptions = (selectedCurrency, conversion_rates) => {
		
	const selectAttribute = currency => 
		currency === selectedCurrency ? 'selected' : ''	
	
	const getOptionsArray = currency => `<option ${selectAttribute(currency)}>${currency}</option>`
	
	return Object.keys(conversion_rates)
						.map(getOptionsArray)
						.join('')
			
	}
	
	const getMultipliedExchangeRate = conversion_rates => {
		const currencyTwo = conversion_rates[currencyTwoD.value]
		return(currencyTimesD.value * currencyTwo).toFixed(2)
	}
	
	const getNotRoundedExchangeRate = conversion_rates => {
		const currencyTwo = conversion_rates[currencyTwoD.value]
		return`1 ${currencyOneD.value} = ${1 * currencyTwo} ${currencyTwoD.value}`
	}
		
	const showUpdateRates = ({conversion_rates}) => {
				
		convertedValueD.textContent = getMultipliedExchangeRate(conversion_rates)
		precisionValueD.textContent = getNotRoundedExchangeRate(conversion_rates)
			
	}
	
	const showInitialInfo = ({conversion_rates})=> {
		
		currencyOneD.innerHTML = getOptions('USD', conversion_rates)
		currencyTwoD.innerHTML = getOptions('PEN', conversion_rates)		
	

		showUpdateRates({conversion_rates})
	}
	const init = async () => {

	
	const url = getUrl('USD')	
	const exchangeRate = await fetchExchangeRate(url)
		
		if (exchangeRate && exchangeRate.conversion_rates) {
			
			showInitialInfo(exchangeRate)		
		}	
	}
		
	handleTimesCurrencyTimesDInput = () => {
		
		const {conversion_rates} = state.getExchangeRate()
		convertedValueD.textContent = getMultipliedExchangeRate(conversion_rates)
	}
	
	handleCurrencyTwoDInput = () => {
		const exchangeRate = state.getExchangeRate()

		showUpdateRates(exchangeRate)
	}	
	
	handleTimesCurrencyTwo = async (e) => {
		const url = getUrl(e.target.value)
		const exchangeRate = await fetchExchangeRate(url)
		
		showUpdateRates(exchangeRate)
	}
	
	currencyTimesD.addEventListener('input',handleTimesCurrencyTimesDInput)
	currencyTwoD.addEventListener('input', handleCurrencyTwoDInput)
	currencyOneD.addEventListener('input', handleTimesCurrencyTwo )
		

	init()
	



