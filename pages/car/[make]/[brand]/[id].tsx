import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Image from 'next/image'
import { GetServerSideProps } from "next"
import { CarModel } from "../../../../api/Car";
import { openDB } from "../../../../openDB";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        margin: 'auto'
    },
    img: {
        width: "100%"
    },
}));

export interface CarDetailsProps {
    car: CarModel | null | undefined
}

export default function CarDetails({ car }: CarDetailsProps) {
    const classes = useStyles();

    if (!car) {
        return (<h2>Sorry! Car not found.</h2>)
    }
    return (
        <div>
            <Paper className={classes.paper}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={5}>
                        <Image className={classes.img} alt="complex" src={car.photoUrl} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={7} container>
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography gutterBottom variant="h5">
                                    {car.make + ' ' + car.model}
                                </Typography>
                                <Typography gutterBottom variant="h4">
                                    ${car.price}
                                </Typography>
                                <Typography gutterBottom variant="body2" color="textSecondary">
                                    Year: {car.year}
                                </Typography>
                                <Typography gutterBottom variant="body2" color="textSecondary">
                                    KMs: {car.kilometers}
                                </Typography>
                                <Typography gutterBottom variant="body2" color="textSecondary">
                                    Fuel type: {car.fuelType}
                                </Typography>
                                <Typography gutterBottom variant="body2" color="textSecondary">
                                    Details: {car.details}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
    const id = ctx.params?.id;
    const db = await openDB();
    const car = await db.get<CarModel | null | undefined>('SELECT * FROM Car where id = ?', id);

    return {
        props: { car: car || null }
    }
}