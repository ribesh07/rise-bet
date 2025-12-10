"use client";

import { useEffect, useState } from "react";
import { getSocket,disconnectSocket } from "../../../../utils/socket";
import { use } from "react";

export default function RouletteTable(props) {
  const { tableId } = use(props.params);


  const [countdown, setCountdown] = useState(15);
  const [result, setResult] = useState(null);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  const socket = getSocket("");   //getSocket("crash")  //route hatai bass ena karab vajat hatai avi roulette k defaault haiii
  //hmmra mapping pathau red me kon nuber aa black me kate sab hv sammhatai

  useEffect(() => {
    if (!socket) return;

    // ❗ FIX: must send room param
    socket.emit("join-room", { room: tableId }, (res) => {
      console.log("Join room:", res);
      setLoading(false);
    });

    socket.on("countdown", (data) => {
      setCountdown(data.seconds)      //countdown data
      console.log("COUNTDOWN scoket:", data);
    });

    socket.on("spin-result", data => {
        console.log("SPIN result:", data);    //result update      eehe me uh code dhadiyai koon
        setResult(data);
    });

    socket.on("countdown", (data) => setCountdown(data.seconds));
    socket.on("bet-placed", (bet) => {
      console.log("Your bet confirmed:", bet);
      // NO RESULT HERE - remove setResult
    });

    socket.on("bet-update", (data) => {
      console.log("Bet Update from room:", data);
      setBets((prev) => [...prev, data]);
    });

    return () => {
      socket.off("countdown");
      socket.off("spin-result");
      socket.off("bet-update");
      socket.off("bet-placed");

      // ❗ FIX: must send room param
      socket.emit("leave-room", { room: tableId });
      disconnectSocket("");
    };    
  }, []);



  const placeBet = (color) => {     //ee ha bet place karake 
    socket.emit(
      "place-bet",
      {
        room: tableId,
        bet: {
          type: "COLOR",
          amount: 5,
          color: color,
        },
      },    //aaiime ok ya karai xi ha oor roomid generate karke ya filhal je hai roommid se raahadu roulette p cliick karte /tableid/ tab gaem k ui 
      // ta eehe page hai working eehene final change karu hatai av win loose na hai bas place bet ha aa result ham update kardeb apne aait hatai ya ham karai xi kokokok
      (res) => {
        if (!res.ok) alert(res.error);
      }
    );
  };

  if (loading) return <div>Joining room...</div>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Roulette Table: {tableId}</h1>

      <div className="mt-6 text-xl">
        Countdown: <span className="font-bold">{countdown}</span>
      </div>

      <div className="mt-4 text-lg">
        {result && (
          <div>
            <strong>Result:</strong> {result.result.number} ({result.result.color})
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button onClick={() => placeBet("RED")} className="bg-red-600 text-white px-4 py-2 rounded">
          Bet RED
        </button>

        <button onClick={() => placeBet("BLACK")} className="bg-black text-white px-4 py-2 rounded">
          Bet BLACK
        </button>

        <button onClick={() => placeBet("GREEN")} className="bg-green-600 text-white px-4 py-2 rounded">
          Bet GREEN
        </button>
      </div>

      <div className="mt-6">
        <div>
          <h2 className="font-bold mb-2 ">Spin Result:</h2>
          {result ? (
            <div>
              Number: {result.result.number}   Color: {result.result.color}
            </div>
          ) : (
            <div>No spins yet.</div>
          )}
        </div>
        <h2 className="font-bold mb-2 ">Live Bets:</h2>
        <ul className="space-y-2">
          {bets.map((b, i) => (
            <li key={i} className="p-2 border rounded">
              Player {b.userId} bet: {JSON.stringify(b.bet)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
