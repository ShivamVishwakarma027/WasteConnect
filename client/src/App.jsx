import React, { useEffect, useMemo, useState } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Recycle,
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  LogOut,
  UserRound,
  Truck,
  Star,
  CheckCircle2,
  Clock3,
  MapPin,
  ArrowRight,
  Leaf,
  Menu,
  X,
} from "lucide-react";
import { api } from "./api";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("wc_user"));
  } catch {
    return null;
  }
};
function saveSession(data) {
  localStorage.setItem("wc_token", data.token);
  localStorage.setItem("wc_user", JSON.stringify(data.user));
}

function App() {
  const [user, setUser] = useState(getUser());
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };
  return (
    <Routes>
      <Route path="/" element={<Landing user={user} />} />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/dashboard" />
          ) : (
            <Auth mode="login" onAuth={(u) => setUser(u)} />
          )
        }
      />
      <Route
        path="/register"
        element={
          user ? (
            <Navigate to="/dashboard" />
          ) : (
            <Auth mode="register" onAuth={(u) => setUser(u)} />
          )
        }
      />
      <Route
        path="/request"
        element={user ? <Request /> : <Navigate to="/login" />}
      />
      <Route
        path="/*"
        element={
          user ? (
            <Dashboard user={user} logout={logout} setUser={setUser} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

function Navbar({ user, logout }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <Recycle size={22} />
          </span>
          Waste<span>Connect</span>
        </Link>
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? "nav-links open" : "nav-links"}>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              {user.role === "user" && (
                <Link to="/request" onClick={() => setOpen(false)}>
                  Request Pickup
                </Link>
              )}
              <button className="logout" onClick={logout}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link
                className="nav-cta"
                to="/register"
                onClick={() => setOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function Landing({ user }) {
  return (
    <>
      <Navbar
        user={user}
        logout={() => {
          localStorage.clear();
          location.href = "/";
        }}
      />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <div className="eyebrow">
                <Leaf size={15} /> Turn waste into value
              </div>
              <h1>
                Recycle smarter.
                <br />
                <em>Live greener.</em>
              </h1>
              <p className="hero-copy">
                Connect your recyclable waste with nearby collectors. Schedule a
                pickup, keep waste out of landfills, and earn rewards.
              </p>
              <div className="hero-actions">
                <Link
                  className="btn primary"
                  to={user ? "/dashboard" : "/register"}
                >
                  Start Recycling <ArrowRight size={18} />
                </Link>
                <a className="btn secondary" href="#how">
                  How it works
                </a>
              </div>
              <div className="trust">
                <div>
                  <b>♻️</b>
                  <span>Simple pickups</span>
                </div>
                <div>
                  <b>⭐</b>
                  <span>Earn points</span>
                </div>
                <div>
                  <b>🌱</b>
                  <span>Cleaner city</span>
                </div>
              </div>
            </div>
            <div className="hero-card">
              <div className="orb">♻</div>
              <div className="float-card fc1">
                <MapPin size={17} />
                <span>
                  <b>Pickup nearby</b>
                  <small>Collector available</small>
                </span>
              </div>
              <div className="float-card fc2">
                <Star size={17} />
                <span>
                  <b>+120 points</b>
                  <small>Reward earned</small>
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="section" id="how">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">THE PROCESS</span>
              <h2>Waste pickup made easy</h2>
              <p>
                From your doorstep to a recycling facility in a few simple
                steps.
              </p>
            </div>
            <div className="steps">
              {[
                [
                  "01",
                  "Choose waste",
                  "Tell us what recyclable material you have.",
                ],
                [
                  "02",
                  "Request pickup",
                  "Add quantity, address and preferred date.",
                ],
                [
                  "03",
                  "Collector accepts",
                  "A collector takes your pickup request.",
                ],
                [
                  "04",
                  "Earn rewards",
                  "Get points when your waste is collected.",
                ],
              ].map((x) => (
                <div className="step" key={x[0]}>
                  <strong>{x[0]}</strong>
                  <h3>{x[1]}</h3>
                  <p>{x[2]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="impact">
          <div className="container impact-grid">
            <div>
              <span className="eyebrow">WHY WASTECONNECT</span>
              <h2>
                Small actions.
                <br />
                Real impact.
              </h2>
            </div>
            <div className="impact-stat">
              <b>100%</b>
              <span>Focused on recyclable collection</span>
            </div>
            <div className="impact-stat">
              <b>24/7</b>
              <span>Request pickups anytime</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Auth({ mode, onAuth }) {
  const nav = useNavigate(),
    [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      role: "user",
    }),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await api.login({ email: form.email, password: form.password })
          : await api.register(form);
      saveSession(data);
      onAuth(data.user);
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-card">
        <div className="auth-logo">
          <Recycle />
        </div>
        <span className="eyebrow">
          {mode === "login" ? "WELCOME BACK" : "JOIN THE MOVEMENT"}
        </span>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p>
          {mode === "login"
            ? "Login to manage your recycling pickups."
            : "Start making a difference with every pickup."}
        </p>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={submit}>
          {mode === "register" && (
            <label>
              Full name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="enter your name"
              />
            </label>
          )}
          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="enter your email"
            />
          </label>
          <label>
            Password
            <input
              required
              minLength="6"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </label>
          {mode === "register" && (
            <label>
              Account type
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">User — request pickups</option>
                <option value="collector">Collector — collect waste</option>
              </select>
            </label>
          )}
          <button className="btn primary full" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create account"}
          </button>
        </form>
        <p className="switch">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <Link to={mode === "login" ? "/register" : "/login"}>
            {mode === "login" ? "Create one" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
}

function Dashboard({ user, logout, setUser }) {
  return (
    <>
      <Navbar user={user} logout={logout} />
      <main className="dash">
        <div className="container">
          <div className="dash-top">
            <div>
              <span className="eyebrow">DASHBOARD</span>
              <h1>Hello, {user.name.split(" ")[0]} </h1>
              <p>
                {user.role === "user"
                  ? "Manage your recycling and pickups."
                  : "Find and complete nearby pickup requests."}
              </p>
            </div>
            {user.role === "user" && (
              <Link className="btn primary" to="/request">
                <PlusCircle size={18} /> New pickup
              </Link>
            )}
          </div>
          {user.role === "user" ? (
            <UserDash user={user} setUser={setUser} />
          ) : (
            <CollectorDash />
          )}
        </div>
      </main>
    </>
  );
}

function UserDash({ user, setUser }) {
  const [items, setItems] = useState([]),
    [loading, setLoading] = useState(true);
  const load = async () => {
    try {
      const x = await api.mine();
      setItems(x);
      const fresh = getUser();
      if (fresh) {
        const pts = x
          .filter((i) => i.status === "Completed")
          .reduce((s, i) => s + i.points, 0);
        fresh.points = pts;
        localStorage.setItem("wc_user", JSON.stringify(fresh));
        setUser({ ...fresh });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const active = items.filter(
    (x) => x.status === "Pending" || x.status === "Accepted",
  ).length;
  return (
    <>
      <div className="stats">
        <Stat icon={<Star />} label="Reward points" value={user.points || 0} />
        <Stat icon={<Clock3 />} label="Active pickups" value={active} />
        <Stat
          icon={<CheckCircle2 />}
          label="Completed"
          value={items.filter((x) => x.status === "Completed").length}
        />
      </div>
      <div className="panel">
        <div className="panel-head">
          <div>
            <h2>Recent pickups</h2>
            <p>Your latest recycling requests</p>
          </div>
          <Link to="/request">View / add pickup</Link>
        </div>
        {loading ? (
          <Empty text="Loading pickups..." />
        ) : items.length ? (
          <div className="pickup-list">
            {items.map((i) => (
              <PickupRow key={i._id} item={i} />
            ))}
          </div>
        ) : (
          <Empty text="No pickups yet. Start with your first recycling request!" />
        )}
      </div>
    </>
  );
}
function CollectorDash() {
  const [available, setAvailable] = useState([]),
    [mine, setMine] = useState([]),
    [tab, setTab] = useState("available"),
    [busy, setBusy] = useState("");
  const load = async () => {
    try {
      setAvailable(await api.available());
      setMine(await api.collector());
    } catch {}
  };
  useEffect(() => {
    load();
  }, []);
  const act = async (type, id) => {
    setBusy(id);
    try {
      type === "accept" ? await api.accept(id) : await api.complete(id);
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy("");
    }
  };
  const accepted = mine.filter((x) => x.status === "Accepted").length,
    done = mine.filter((x) => x.status === "Completed").length;
  return (
    <>
      <div className="stats">
        <Stat
          icon={<Truck />}
          label="Available requests"
          value={available.length}
        />
        <Stat icon={<Clock3 />} label="Active pickups" value={accepted} />
        <Stat icon={<CheckCircle2 />} label="Completed" value={done} />
      </div>
      <div className="tabs">
        <button
          className={tab === "available" ? "active" : ""}
          onClick={() => setTab("available")}
        >
          Available ({available.length})
        </button>
        <button
          className={tab === "mine" ? "active" : ""}
          onClick={() => setTab("mine")}
        >
          My pickups ({mine.length})
        </button>
      </div>
      <div className="panel">
        {tab === "available" ? (
          <div className="collector-grid">
            {available.map((i) => (
              <CollectorCard
                key={i._id}
                item={i}
                action={() => act("accept", i._id)}
                busy={busy === i._id}
              />
            ))}
          </div>
        ) : (
          <div className="collector-grid">
            {mine.map((i) => (
              <CollectorCard
                key={i._id}
                item={i}
                action={
                  i.status === "Accepted" ? () => act("complete", i._id) : null
                }
                busy={busy === i._id}
              />
            ))}
          </div>
        )}
        {((tab === "available" && available.length === 0) ||
          (tab === "mine" && mine.length === 0)) && (
          <Empty text="Nothing here right now." />
        )}
      </div>
    </>
  );
}
function Stat({ icon, label, value }) {
  return (
    <div className="stat">
      <div className="stat-icon">{icon}</div>
      <div>
        <b>{value}</b>
        <span>{label}</span>
      </div>
    </div>
  );
}
function PickupRow({ item }) {
  return (
    <div className="pickup-row">
      <div className="waste-icon">♻</div>
      <div className="row-main">
        <b>{item.wasteType}</b>
        <span>
          {item.quantity} {item.unit} ·{" "}
          {new Date(item.pickupDate).toLocaleDateString()}
        </span>
        <small>
          <MapPin size={13} />
          {item.address}
        </small>
      </div>
      <span className={"status " + item.status.toLowerCase()}>
        {item.status}
      </span>
      <strong className="points">+{item.points}</strong>
    </div>
  );
}
function CollectorCard({ item, action, busy }) {
  return (
    <div className="collector-card">
      <div className="card-top">
        <span className="tag">{item.wasteType}</span>
        <span className={"status " + item.status.toLowerCase()}>
          {item.status}
        </span>
      </div>
      <h3>
        {item.quantity} {item.unit} of {item.wasteType}
      </h3>
      <p className="person">
        <UserRound size={16} />
        {item.user?.name || "User"}
      </p>
      <p>
        <MapPin size={16} />
        {item.address}
      </p>
      <p>
        <Clock3 size={16} />
        {new Date(item.pickupDate).toLocaleString()}
      </p>
      <div className="card-foot">
        <b>+{item.points} points</b>
        {action && (
          <button
            className="btn primary small"
            disabled={busy}
            onClick={action}
          >
            {busy
              ? "Updating..."
              : item.status === "Accepted"
                ? "Mark completed"
                : "Accept pickup"}
          </button>
        )}
      </div>
    </div>
  );
}
function Empty({ text }) {
  return (
    <div className="empty">
      <div>♻️</div>
      <p>{text}</p>
    </div>
  );
}

function Request() {
  const nav = useNavigate(),
    [form, setForm] = useState({
      wasteType: "Newspaper",
      quantity: "",
      unit: "kg",
      address: "",
      pickupDate: "",
      notes: "",
    }),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.createPickup({ ...form, quantity: Number(form.quantity) });

      nav("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar
        user={getUser()}
        logout={() => {
          localStorage.clear();
          nav("/");
        }}
      />
      <main className="dash">
        <div className="container narrow">
          <div className="form-heading">
            <Link to="/dashboard">← Back to dashboard</Link>
            <span className="eyebrow">NEW PICKUP</span>
            <h1>Schedule a recycling pickup</h1>
            <p>Tell us what you want to recycle and where to collect it.</p>
          </div>
          {error && <div className="alert">{error}</div>}
          <form className="request-form" onSubmit={submit}>
            <div className="form-grid">
              <label>
                Waste type
                <select
                  value={form.wasteType}
                  onChange={(e) => change("wasteType", e.target.value)}
                >
                  {[
                    "Newspaper",
                    "Cardboard",
                    "Plastic",
                    "E-Waste",
                    "Metal",
                    "Glass",
                    "Other",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <div className="qty">
                <label>
                  Quantity           
                  <input 
                  required                    
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(e) => change("quantity", e.target.value)}
                    placeholder="e.g. 10"
                  />
                </label>
                <label>
                  Unit
                  
                  <select
                    value={form.unit}
                    onChange={(e) => change("unit", e.target.value)}
                  >
                    <option>kg</option>
                    <option>items</option>
                    <option>bags</option>
                  </select>
                </label>
              </div>
              <label>
                Pickup date & time
                <input
                  required
                  type="datetime-local"
                  value={form.pickupDate}
                  onChange={(e) => change("pickupDate", e.target.value)}
                />
              </label>
              <label className="span2">
                Pickup address
                <textarea
                  required
                  rows="3"
                  value={form.address}
                  onChange={(e) => change("address", e.target.value)}
                  placeholder="House no., street, area, city..."
                />
              </label>
              <label className="span2">
                Notes <span className="optional">optional</span>
                <textarea
                  rows="3"
                  value={form.notes}
                  onChange={(e) => change("notes", e.target.value)}
                  placeholder="Gate number, landmark, special instructions..."
                />
              </label>
            </div>
            <div className="request-bottom">
              <div>
                <b>Estimated reward</b>
                <span>Points are awarded after pickup is completed.</span>
              </div>
              <button className="btn primary" disabled={loading}>
                {loading ? "Submitting..." : "Request pickup"}{" "}
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
function Footer() {
  return (
    <footer>
      <div className="container footer-inner">
        <div className="brand">
          <span className="brand-icon">
            <Recycle size={18} />
          </span>
          Waste<span>Connect</span>
        </div>
        <p>Making recycling simple, one pickup at a time.</p>
      </div>
    </footer>
  );
}
export default App;
