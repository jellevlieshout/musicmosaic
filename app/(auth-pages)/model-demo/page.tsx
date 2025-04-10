import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
 

  return (
    <>
  <h1>MusicMosaic Console Galore</h1>
  <p>Because GUIs are overrated.</p>
  <ol>
    <li>Open DevTools</li>
    <li> >> myModel.setPlaylist(myDemoPlaylist) </li>
    <li> >> myModel.seatPlayersInRandomOrder(myDemoPlayers) </li>
    <li> >> myModel.playRandomNewSongFromCurrentPlaylist() </li>
    <li> >> myModel.revealSongDetails() </li>
    <li> One of two options
      <ol>
	<li> >> myModel.playerWasRight() </li>
	<li> >> myModel.playerWasWrong() </li>
      </ol>
    </li>
    <li> Go back to step 4 and keep having fun </li>
  </ol>
    </>
  );
}
