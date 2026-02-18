import { Star } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-center text-gray-700 p-4 mt-auto">
      <Star className="h-4 w-4" />
      <p>&copy; {new Date().getFullYear()} Todo App. All rights reserved.</p>
    </footer>
  );
}
