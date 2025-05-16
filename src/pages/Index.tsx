
import Header from "@/components/Header";
import Chat from "@/components/Chat";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-6">
        <Chat />
      </div>
    </div>
  );
};

export default Index;
