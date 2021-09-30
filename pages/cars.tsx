import { Grid } from "@material-ui/core";
import { PaginationRenderItemParams } from '@material-ui/lab';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { useRouter } from 'next/router';
import { GetServerSideProps } from "next";
import { ParsedUrlQuery, stringify } from 'querystring';
import deepEqual from 'fast-deep-equal';
import Search from ".";
import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from "../database/getModels";
import { getPaginetedCars } from "../database/getPaginatedCars";
import { getAsString } from "../utilities/getAsString";
import { CarModel } from '../api/Car';
import React, { forwardRef, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { CarCard } from "../components/CarCard";

export interface CarsListProps {
    makes: Make[];
    models: Model[];
    cars: CarModel[];
    totalPages: number;
}

export default function CarsList({ makes, models, cars, totalPages }: CarsListProps) {
    const { query } = useRouter();
    const [serverQuery] = useState(query);

    const { data } = useSWR('/api/cars?' + stringify(query));

    console.log(data);

    return <Grid container spacing={3}>
        <Grid item xs={12} sm={5} md={3} lg={2}>
            <Search singleColumn makes={makes} models={models} />
        </Grid>
        <Grid container item xs={12} sm={7} md={9} lg={10} spacing={2}>
                <Grid item xs={12}>
                    <Pagination
                        page={parseInt(getAsString(query.page) || '1')}
                        count={totalPages}
                        renderItem={(item) => (
                            <PaginationItem
                                component={MaterialUiLink}
                                query={query}
                                item={item}
                                {...item}
                            />
                        )}
                    />
                </Grid>
                {/* <Grid item xs={12}> */}
                    {(data?.cars || []).map((car: CarModel) => (
                        <Grid key={car.id} item xs={12} sm={6}>
                            <CarCard car={car} />
                        </Grid>
                    ))}
                {/* </Grid> */}
        </Grid>
    </Grid>
}

export interface MaterialUiLinkProps {
    item: PaginationRenderItemParams;
    query: ParsedUrlQuery;
}

export const MaterialUiLink = forwardRef<HTMLAnchorElement, MaterialUiLinkProps>(({ item, query, ...props }, ref) => (
    <Link
        href={{
            pathname: '/cars',
            query: { ...query, page: item.page },
        }}
    >
        <a {...props} ref={ref}></a>
    </Link>
))

// export function MaterialUiLink({ item, query, ...props }: MaterialUiLinkProps) {
//     return (
//         <Link
//             href={{
//                 pathname: '/cars',
//                 query: { ...query, page: item.page },
//             }} shallow
//         >
//             <a {...props}></a>
//         </Link>
//     );
// }

export const getServerSideProps: GetServerSideProps = async ctx => {
    const make = getAsString(ctx.query.make)
    // const makes = await getMakes()
    // const models = await getModels(make)
    const [makes, models, pagination] = await Promise.all([getMakes(), getModels(make), getPaginetedCars(ctx.query)])

    console.log(pagination);

    return {
        props: { makes, models, cars: pagination.cars, totalPages: pagination.totalPages }
    }
}
