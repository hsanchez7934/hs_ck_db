class DrinkLocalStorage {
	data: any[]
	constructor() {
		this.data = []
	}

	private getSavedDrinks = () => {
		const savedDrinks = localStorage.getItem('mydrinks') || '[]'
		const parsed = JSON.parse(savedDrinks)
		return parsed
	}

	public init = () => {
		this.data = this.getSavedDrinks()
	}

	public isDrinkSaved = (id: string | number | undefined | null) => {
		const found = this.data.find((drink: any) => drink.idDrink === id)
		return found
	}

	public saveDrink = (drink: any) => {
		this.data.push(drink)
		localStorage.setItem('mydrinks', JSON.stringify(this.data))
	}

	public removeDrink = (id: any) => {
		const filtered = this.data.filter((drink: any) => drink.idDrink !== id)
		this.data = filtered
		localStorage.setItem('mydrinks', JSON.stringify(filtered))
	}

	public getDrinkData = () => this.data
}

export default DrinkLocalStorage
