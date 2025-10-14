import AsyncStorage from '@react-native-async-storage/async-storage';

const get = async (key: string): Promise<any> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    if (__DEV__) {
      console.log('Erro ao salvar no storage: ' + e);
    }
    return null;
  }
};

const set = async (key: string, value: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (__DEV__) {
      console.log('Erro ao salvar no storage: ' + e);
    }
  }
};

const remove = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    if (__DEV__) {
      console.log('Erro ao salvar no storage: ' + e);
    }
  }
};

const storage = {
  get,
  set,
  remove,
};

export { storage };
