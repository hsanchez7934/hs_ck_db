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
			fetchDrinkByName: builder.query({
				query: (letter) => {
					return {
						url: '/search.php',
						params: {
							f: letter
						}
					}
				}
			})
		}
	}
})

export {drinksAPI}
export const {useFetchRandomDrinksQuery, useFetchPopularDrinksQuery, useFetchDrinkByNameQuery} = drinksAPI
