import express from "express";
import { Room } from "../../models";

class RoomController {

    async index(req: express.Request, res: express.Response) {
        try {
            const items = await Room.findAll();
            res.json(items);
        } catch (error) {
            res.status(500).json({ message: 'Error', error });
        }
    }

    async create(req: express.Request, res: express.Response) {
        try {
            const data = {
                title: req.body.title,
                type: req.body.type,
            };

            if (!data.title || !data.type) {
                return res.status(400).json({ message: 'Відсутня назва або тип кімнати' });
            }

            const room = await Room.create(data);
            res.status(201).json(room);
        } catch (error) {
            res.status(500).json({ message: 'Error', error });
        }
    }

    async show(req: express.Request, res: express.Response) {
        try {
            const roomId = req.params.id;

            if (isNaN(Number(roomId))) {
                return res.status(404).json({ message: 'Невірний Id кімнати' });
            }

            const room = await Room.findByPk(roomId);

            if (!room) {
                return res.status(404).json({ message: 'Кімната не знайдена' });
            }

            res.json(room);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error', error });
        }
    }

    async delete(req: express.Request, res: express.Response) {
        try {
            const roomId = req.params.id;

            if (isNaN(Number(roomId))) {
                return res.status(404).json({ message: 'Невірний Id кімнати' });
            }

            await Room.destroy({
                where: { id: roomId },
            });

            res.send();
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error', error });
        }
    }

}

export default new RoomController();