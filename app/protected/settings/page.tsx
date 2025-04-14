import SettingsView from "@/views/SettingsView";
import { getUserLocation } from '@/utils/locationApi';

export default async function SettingsPresenter() {
  const loc = await getUserLocation();
  return (
    <SettingsView 
    location = {`${loc.city}, ${loc.country}`}/>
  );
}