import { useEffect, useState } from 'react';
import * as Camera from 'expo-camera';

const useCameraPermission = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      setIsLoading(false);
    })();
  }, []);

  return { hasPermission, isLoading };
};

export default useCameraPermission;