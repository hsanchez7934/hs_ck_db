import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {DrinksDataResponse} from '../../types'

const drinksAPI = createApi({
	reducerPath: 'drinks',
	baseQuery: fetchBaseQuery({
		baseUrl: `https://www.thecocktaildb.com/api/json/v2/${process.env.REACT_APP_COCKTAIL_DB_API_KEY}/`
	}),
	endpoints: (builder) => {
		return {
			fetchRandomDrinks: builder.query({
				query: () => {
					return {
						url: '/randomselection.php',
						method: 'GET'
					}
				}
			}),
			fetchPopularDrinks: builder.query<DrinksDataResponse, void>({
				query: () => {
					return {
						url: '/popular.php',
						method: 'GET'
					}
				}
			}),
			fetchDrinksByFirstLetter: builder.query<DrinksDataResponse, string>({
				query: (letter) => {
					return {
						url: '/search.php',
						params: {
							f: letter
						}
					}
				}
			}),
			fetchDrinksByKeyword: builder.query({
				query: (keyword) => {
					return {url: '/search.php', params: {s: keyword}}
				}
			}),
			fetchDrinkDataByID: builder.query({
				query: (id) => {
					return {url: '/lookup.php', params: {i: id}}
				}
			}),
			fetchDrinksBySpirit: builder.query({
				query: (spirit) => {
					return {url: '/filter.php', params: {i: spirit}}
				}
			}),
			fetchNonAlcoholicDrinks: builder.query({
				query: (query) => {
					return {url: '/filter.php', params: {a: query}}
				}
			}),
			fetchIngredients: builder.query({
				query: (query) => {
					return {url: 'list.php', params: {i: query}}
				}
			}),
			fetchDrinkByIngredient: builder.query({
				query: (ingredient) => {
					return {url: '/filter.php', params: {i: ingredient}}
				}
			})
		}
	}
})

export {drinksAPI}
export const {
	useFetchRandomDrinksQuery,
	useFetchPopularDrinksQuery,
	useFetchDrinksByFirstLetterQuery,
	useFetchDrinksByKeywordQuery,
	useFetchDrinkDataByIDQuery,
	useFetchDrinksBySpiritQuery,
	useFetchNonAlcoholicDrinksQuery,
	useFetchIngredientsQuery,
	useFetchDrinkByIngredientQuery
} = drinksAPI
