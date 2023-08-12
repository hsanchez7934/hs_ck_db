import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {apiKey} from '../../apiKey'
import {DrinksDataResponse} from '../../types'

const drinksAPI = createApi({
	reducerPath: 'drinks',
	baseQuery: fetchBaseQuery({
		baseUrl: `https://www.thecocktaildb.com/api/json/v2/${apiKey}/`
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
	useFetchDrinkDataByIDQuery
} = drinksAPI
