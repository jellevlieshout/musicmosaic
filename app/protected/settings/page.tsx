import SettingsView from "@/views/SettingsView";
import { getUserEmailData } from "./playerData";
import { getUserLocation } from '@/utils/locationApi';

export default async function SettingsPresenter() {
  const loc = await getUserLocation();
  const email = await getUserEmailData();
  console.log(email);
  return (
    <SettingsView 
    location = {`${loc.city}, ${loc.country}`}
    email = {email}/>
  );
}