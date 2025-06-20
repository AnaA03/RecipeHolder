import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class DeviceIdService {

  private readonly DEVICE_ID_KEY = 'device_id';

  getDeviceId(): string {
    let id = localStorage.getItem(this.DEVICE_ID_KEY);
    if (!id) {
      id = uuidv4();
      localStorage.setItem(this.DEVICE_ID_KEY, id);
    }
    return id;
  }
}
