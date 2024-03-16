let socket: any;

function connect2socket() {
    socket = io("http://localhost:3001", {
        query: {
            id: localStorage.getItem("id") || "",
            password: localStorage.getItem("password") || "",
        },
    });

    socket.on("error", (err) => {
        addToast({ text: err, type: "error" });

        setTimeout(() => {
            removeToast(toasts.length - 1);
        }, 4_000);

        if (err == "401") {
            connectTryCount++;
            setAuthModalVissibleModal(true);
        }
    });

    socket.on("data", (data: any) => {
        console.log(data.gameStats);
        data.gameStats.balance = parseInt(data.gameStats.balance);
        updateUserData(data);
        __isAuthorized__.value = true;
        socket.emit("getLeaderboard");
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
        __isAuthorized__.value = false;
    });

    socket.on("leaderboard", (data: any) => {
        data = JSON.parse(data);
        console.log("leaderboard: ", data);
        setLeaderoard(data);
    });

    return socket;
}