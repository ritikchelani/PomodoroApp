import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

export default function Dashboard() {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [flag, setFlag] = useState(false);
  const [worksecond, setWorkSecond] = useState(1500);
  const [breaksecond, setBreakSecond] = useState(300);
  const [type, setType] = useState("work");
  const [resetFlag, setResetFalg] = useState(true);

  useEffect(() => {
    if (flag && type === "work") {
      if (worksecond > 0) {
        const timer = setTimeout(() => setWorkSecond(worksecond - 1), 1000);
        return () => clearTimeout(timer);
      }
      if (worksecond === 0) {
        alert("work duration is over");
        setType("break");
        setWorkSecond(workDuration * 60);
      }
    }
    if (flag && type === "break") {
      if (breaksecond > 0) {
        const timer = setTimeout(() => setBreakSecond(breaksecond - 1), 1000);
        return () => clearTimeout(timer);
      }
      if (breaksecond === 0) {
        alert("break duration is over");
        setType("work");
        setBreakSecond(breakDuration * 60);
      }
    }
  }, [flag, type, worksecond, breaksecond, workDuration, breakDuration]);

  const reset = () => {
    setResetFalg(true);
    setFlag(false);
    setType("work");
    setWorkDuration(25);
    setBreakDuration(5);
    setBreakSecond(300);
    setWorkSecond(1500);
  };

  const convertToStandardFormat = (sec) => {
    let m = parseInt(sec / 60).toString();
    let s = parseInt(sec % 60).toString();
    if (m.length === 1) m = "0" + m;
    if (s.length === 1) s = "0" + s;
    return m + ":" + s;
  };
  const validateData = (data) => {
    if (!isNaN(data) && parseInt(data) >= 0) {
      return parseInt(data);
    } else return "";
  };
  const setDuration = (e) => {
    e.preventDefault();
    if (breakDuration + workDuration <= 0) {
      reset();
      return;
    }
    setResetFalg(false);
    setType("work");
    setWorkSecond(workDuration * 60);
    setBreakSecond(breakDuration * 60);
  };

  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Pomodoro</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          <div className="clock">
            <h1 className="timer">
              {type === "work"
                ? convertToStandardFormat(worksecond)
                : convertToStandardFormat(breaksecond)}
            </h1>
            <h3>{type === "work" ? "Work" : "Break"}-Time</h3>
          </div>
          <div className="control">
            <button
              key="start"
              onClick={() => {
                setFlag(true);
                setResetFalg(false);
              }}
              disabled={flag}
            >
              start
            </button>
            <button
              key="stop"
              onClick={() => {
                setFlag(false);
                setResetFalg(false);
              }}
              disabled={!flag}
            >
              Stop
            </button>
            <button
              key="reset"
              onClick={() => {
                reset();
              }}
              disabled={resetFlag}
            >
              Reset
            </button>
          </div>
          <br></br>
          <div className="parameters">
            <form onSubmit={setDuration}>
              <input
                placeholder="work duration"
                required
                type="Number"
                value={workDuration}
                disabled={flag}
                onChange={(e) => setWorkDuration(validateData(e.target.value))}
              ></input>
              <input
                placeholder="break duration"
                required
                type="Number"
                value={breakDuration}
                disabled={flag}
                onChange={(e) => setBreakDuration(validateData(e.target.value))}
              ></input>
              <button type="submit" disabled={flag}>
                set
              </button>
            </form>
          </div>
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Change user profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  );
}
