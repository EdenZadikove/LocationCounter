import Controller from './controller';
import { Response } from 'express';
import { Request } from 'express';
import { param, check, validationResult } from 'express-validator';
import { wrap } from '../util/wrapper';
import { SensorBase } from '../models/sensor/sensor-base';
import { SensorDate } from '../models/sensor/sensor-date';
import {
  getAllSsensorsDb,
  getSensorByIdDb,
  getAllSensorsEventDb,
  getAllSensorsEventByIdDb,
  updateLocationDb,
} from '../models/sensor/sensor-models';
import { SensorLocation } from '../models/sensor/sensor-location';

class SensorContoller extends Controller {
  public path = '/sensor';
  public idPrefix: string = '/:id';

  private id: string = 'id';
  constructor() {
    super();
    this.intializeRoutes();
  }

  public intializeRoutes(): void {
    // get all sensors
    this.router.get(this.path, this.getAllSsensors);
    this.router.get(
      this.path + this.idPrefix,
      [param(this.id).isNumeric()],
      this.getSensorById
    );
    this.router.post(
      this.path + '/GetAllSensorsEvent',
      this.getAllSensorsEvent
    );
    this.router.post(
      this.path + '/GetAllSensorsEventById',
      [check('sensor_id').isNumeric()],
      this.getAllSensorsEventById
    );

    this.router.patch(
      this.path + '/UpdateLocation',
      [check('data').isArray()],
      this.updateLocation
    );

    // this.router.get(this.path + this.idPrefix,[param('id').isNumeric()],this.getBuildingByID);

    // this.router.post(this.path,[check('number_of_floors').isNumeric()],this.generateBuilding);

    // this.router.patch(this.path + this.idPrefix,[param('id').isNumeric()],this.patchBuilding);

    // this.router.delete(this.path + this.idPrefix,[param('id').isNumeric()],this.deleteBuilding);
  }

  getAllSsensors = async (req: Request, res: Response) => {
    try {
      const sensors = await getAllSsensorsDb();
      return res.json(wrap(sensors));
    } catch (err) {
      res.status(500).json({ errors: err.detail });
    }
  };

  getSensorById = async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }
    let id: string = req.params.id;
    try {
      let results = await getSensorByIdDb(id);
      return res.status(200).json(wrap(results));
    } catch (err) {
      return res.status(500).json({ errors: err.detail });
    }
  };

  getAllSensorsEvent = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    const date: SensorBase = req.body;
    try {
      let results = await getAllSensorsEventDb(date);
      return res.status(200).json(wrap(results));
    } catch (err) {
      return res.status(500).json({ errors: err.detail });
    }
  };

  getAllSensorsEventById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    const date: SensorDate = req.body;
    try {
      let results = await getAllSensorsEventByIdDb(date);
      return res.status(200).json(wrap(results));
    } catch (err) {
      return res.status(500).json({ errors: err.detail });
    }
  };

  updateLocation = async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }
    const data: SensorLocation[] = req.body.data;
    try {
      let responseArr: SensorLocation[] = [];

      for (let index = 0; index < data.length; index++) {
        const result = await updateLocationDb(
          data[index].location,
          data[index].sensor_id
        );
        responseArr.push(result[0]);
      }
      // // date.forEach((x) => responseArr.push(await updateLocationDb(x)));
      // // let results = await updateLocationDb(date);
      console.log(responseArr);

      return res.status(200).json(wrap(responseArr));
    } catch (err) {
      return res.status(500).json({ errors: err.detail });
    }
  };

  //   getBuildingByID = async (req: Request, res: Response): Promise<Response> => {
  //     const errors = validationResult(req);

  //     if (!errors.isEmpty()) {
  //       return res.status(404).json({ errors: errors.array() });
  //     }
  //     let id: string = req.params.id;
  //     try {
  //       let results = await getBuildingById(id);
  //       return res.status(200).json(wrap(results));
  //     } catch (err) {
  //       return res.status(500).json({ errors: err.detail });
  //     }
  //   };

  //   generateBuilding = async (req: Request, res: Response): Promise<Response> => {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res.status(404).json({ errors: errors.array() });
  //     }

  //     let buidling: Building = req.body;
  //     try {
  //       let results = await insertBuilding(buidling);
  //       return res.status(200).json(wrap(results));
  //     } catch (err) {
  //       return res.status(500).json({ errors: err.detail });
  //     }
  //   };

  //   patchBuilding = async (req: Request, res: Response): Promise<Response> => {
  //     const errors = validationResult(req);

  //     if (!errors.isEmpty()) {
  //       return res.status(404).json({ errors: errors.array() });
  //     }
  //     let id: string = req.params.id;
  //     let buidling: Building = req.body;
  //     try {
  //       buidling.id = id;
  //       let results = await updateBuilding(buidling);
  //       return res.status(200).json(wrap(results));
  //     } catch (err) {
  //       return res.status(500).json({ errors: err.detail });
  //     }
  //   };

  //   deleteBuilding = async (req: Request, res: Response): Promise<Response> => {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res.status(404).json({ errors: errors.array() });
  //     }
  //     let id: string = req.params.id;
  //     try {
  //       let rows = await deleteBuilding(id);
  //       return res.status(200).json(wrap({ rows }));
  //     } catch (err) {
  //       return res.status(500).json({ errors: err.detail });
  //     }
  //   };
}

export default SensorContoller;
