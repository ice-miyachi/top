import HomePage from "./ice_miyachi"; // ← これが原因！
export default HomePage;               // ← これも不要！

export default function Home() {
  return <div>Home</div>;
}