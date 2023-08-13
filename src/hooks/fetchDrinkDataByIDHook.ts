import {useFetchDrinkDataByIDQuery} from '../store'

const useFetchDrinkDataByIDHook = (id: string | number | any) => {
	const {data, error, isFetching} = useFetchDrinkDataByIDQuery(id)
	return {data, error, isFetching}
}

export default useFetchDrinkDataByIDHook
