import { ParsedUrlQuery } from 'querystring';
import { CarModel } from '../api/Car';
import { openDB } from '../openDB';
import { getAsString } from '../utilities/getAsString';

const mainQuery = `
    FROM car
    WHERE (@make is NULL OR @make = make)
    AND (@model is NULL OR @model = model)
    AND (@minPrice is NULL OR @minPrice <= price)
    AND (@maxPrice is NULL OR @maxPrice >= price)
`

export async function getPaginetedCars(query: ParsedUrlQuery) {
    const db = await openDB();

    const page = getValueNumber(query.page) || 1;
    const rowsPerPage = getValueNumber(query.rowsPerPage) || 4;
    const offset = (page - 1) * rowsPerPage;

    const dbParams = {
        '@make': getValueStr(query.make),
        '@model': getValueStr(query.model),
        '@minPrice': getValueNumber(getValueStr(query.minPrice)),
        '@maxPrice': getValueNumber(getValueStr(query.maxPrice))
    }
    const carsPromise = db.all<CarModel[]>(`
        SELECT * ${mainQuery} LIMIT @rowsPerPage OFFSET @offset
    `, {
        ...dbParams,
        '@rowsPerPage': rowsPerPage,
        '@offset': offset
    })

    const totalRowsPromise = db.get<{ count: number }>(`SELECT COUNT(*) as count ${mainQuery}`, dbParams)

    const [cars, totalRows] = await Promise.all([carsPromise, totalRowsPromise]);

    console.log(totalRows);
    
    return { cars, totalPages: Math.ceil(totalRows!.count / rowsPerPage) };
}

function getValueNumber(value: string | string[] | undefined | null) {
    if (!value)
        return null;

    const str = getValueStr(value);
    if (!str)
        return null;
    const number = parseInt(str);
    return isNaN(number) ? null : number;
}

function getValueStr(value: string | string[] | undefined) {
    const str = getAsString(value);
    return !str || str.toLocaleLowerCase() === 'all' ? null : str;
}