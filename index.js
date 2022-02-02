
	
	const currencyOneD= document.querySelector('[data-js="currency-one"]')
	const currencyTwoD = document.querySelector('[data-js="currency-two"]')
	const currenciesD = document.querySelector('[data-js="currencies-container"]')
	const convertedValueD = document.querySelector('[data-js="converted-value"]')
	const precisionValueD = document.querySelector('[data-js="conversion-precision"]')
	const currencyTimesD = document.querySelector('[data-js="currency-one-times"]')


	let internalExchangeRate = {}

// tmDV9V4bA8TaFFM


// Your API Key: b8be350b9653c107d997c6ef
// Example Request: https://v6.exchangerate-api.com/v6/b8be350b9653c107d997c6ef/latest/USD
	const getUrl = currency => `https://v6.exchangerate-api.com/v6/b8be350b9653c107d997c6ef/latest/${currency}`
	const getErrormessage = errorType => ({
		'unsupported-code':'La moneda no existe en nuestra base de datos',
		'malformed:request':'La escructura de solicitud de informacion no es la correcta',
		'invalid-key':'Tu clave para obtener inforamcion es invalida',
		'quota-reached':'Haz alcanzado tu numero maxio de solicitudes permitidas'
	})[errorType] || 'No fue posible obtener esa informacion.'

	//Esta funcion crea un objeto y recibe un parametro obj[]

	// Se usa convenciones para almacenar los elemtos seleecionados del DOM
	// Uso de innerHTML para manipular los datos de DOM



	/*ERROR 
	{ 	result: "error",
		documentation: "https://www.exchangerate-api.com/docs", 
		"terms-of-use": "https://www.exchangerate-api.com/terms",
		"error-type": "unsupported-code" 
	}*/

	const fetchExchangeRate = async url => {

	try {
		const response = await fetch(url)
		
		//console.log(response.ok)
				
		if(!response.ok){
			throw new Error('Su conexion fallo. No fue posible otbener esa informacion.')
			
		}
		//console.log(response)
		//console.log(response.ok)
				
		const exchangeRateData = await  response.json() 
		
		//console.log(exchangeRateData)
		
		if (exchangeRateData.result === 'error') {
			throw new Error(getErrormessage(exchangeRateData['error-type']))
		}		
		return exchangeRateData
	}

	catch (err) {
		//alert(err.message)
		
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
		
		button.addEventListener('click',() => {
		
			div.remove()
		})		
		}
	}

	const init = async () => {

	//const exchangeRateData = await fetchExchangeRate(getUrl('USD'))
	
	internalExchangeRate = {...(await fetchExchangeRate(getUrl('USD')))}
	
	//console.log(internalExchangeRate)
		
				
	const getOptions = selectedCurrency => Object.keys(internalExchangeRate.conversion_rates)
						.map(currency => `<option ${currency === selectedCurrency ? 'selected' : ''}>${currency}</option>`).join('')
					
	//console.log(options)

	currencyOneD.innerHTML = getOptions('USD')
	currencyTwoD.innerHTML = getOptions('PEN')
	
	//console.log(currencyTwoD.value)
	
	convertedValueD.textContent = internalExchangeRate.conversion_rates.PEN.toFixed(2)
	precisionValueD.textContent = `1 USD = ${internalExchangeRate.conversion_rates.PEN.toFixed(2)} PEN`
		
	}

	currencyTimesD.addEventListener('input',(e) => {

	convertedValueD.textContent = (e.target.value * internalExchangeRate.conversion_rates[currencyTwoD.value]).toFixed(2)
	
	})
	
	currencyTwoD.addEventListener('input', (e) => {
		
		const currencyTwoValue = internalExchangeRate.conversion_rates[e.target.value]
		
		convertedValueD.textContent = (currencyTimesD.value * currencyTwoValue).toFixed(2)
		precisionValueD.textContent =`1 ${currencyOneD.value} = ${1 * (internalExchangeRate.conversion_rates[currencyTwoD.value]).toFixed(2)} ${currencyTwoD.value}` 
	
	})
	
	currencyOneD.addEventListener('input', async e => {
		internalExchangeRate = {...(await fetchExchangeRate(getUrl(e.target.value)))}
	
		convertedValueD.textContent = (currencyTimesD.value * internalExchangeRate.conversion_rates[currencyTwoD.value]).toFixed(2)
		precisionValueD.textContent = `1 ${currencyOneD.value} = ${1 * internalExchangeRate.conversion_rates[currencyTwoD.value]} ${currencyTwoD.value}`
		//console.log(internalExchangeRate)
	})
		

	init()
	
	


	//console.log(currencyOneD, currencyTwoD)

