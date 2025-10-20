import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
// We no longer need the 'LocationGeofencingRegion' named import
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logGeofenceEvent } from './firestoreService';

export const GEOFENCE_TASK_NAME = 'geofence-attendance-task';

const STUDENT_UID_KEY = 'student_uid';
const STUDENT_NAME_KEY = 'student_name';

TaskManager.defineTask(
  GEOFENCE_TASK_NAME,
  async ({ data, error }: TaskManager.TaskManagerTaskBody) => {
    if (error) {
      console.error('TaskManager Error:', error);
      return;
    }

    if (data) {
      // --- THIS IS THE FIX ---
      // We define the 'region' type inline to avoid import errors.
      const { eventType, region } = data as {
        eventType: Location.GeofencingEventType;
        region: {
          identifier?: string | null;
          latitude: number;
          longitude: number;
          radius: number;
        };
      };
      // ----------------------

      try {
        const studentId = await AsyncStorage.getItem(STUDENT_UID_KEY);
        const studentName = await AsyncStorage.getItem(STUDENT_NAME_KEY);

        if (!studentId || !studentName) {
          console.error('Geofence Task: Student ID or Name not found.');
          return;
        }

        if (eventType === Location.GeofencingEventType.Enter) {
          console.log('Geofence Task: User entered region:', region.identifier);
          await logGeofenceEvent(studentId, studentName, 'enter');
        } else if (eventType === Location.GeofencingEventType.Exit) {
          console.log('Geofence Task: User exited region:', region.identifier);
          await logGeofenceEvent(studentId, studentName, 'exit');
        }
      } catch (err: any) {
        console.error('Geofence Task: Error handling event:', err.message);
      }
    }
  }
);