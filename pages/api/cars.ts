import { NextApiRequest, NextApiResponse } from "next";
import { getPaginetedCars } from "../../database/getPaginatedCars";

export default async function cars(req: NextApiRequest, res: NextApiResponse){
    const cars = await getPaginetedCars(req.query);
    res.json(cars);
}