import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {apiKey} from '../../apiKey'

const drinksAPI = createApi({
	reducerPath: 'drinks',
	baseQuery: fetchBaseQuery({
		baseUrl: `https://www.thecocktaildb.com/api/json/v2/${apiKey}/`
	}),
	endpoints: (builder: any) => {
		return {
			fetchRandomDrinks: builder.query({
				query: () => {
					return {
						url: '/randomselection.php',
						method: 'GET'
					}
				}
			}),
			fetchPopularDrinks: builder.query({
				query: () => {
					return {
						url: '/popular.php',
						method: 'GET'
					}
				}
			})
		}
	}
})

export {drinksAPI}
export const {useFetchRandomDrinksQuery, useFetchPopularDrinksQuery} = drinksAPI
