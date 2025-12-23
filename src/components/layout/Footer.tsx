import { Link } from "react-router-dom";
import { GraduationCap, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-accent">
                <GraduationCap className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-heading text-xl font-bold text-foreground">
                PrepLab
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your complete interview preparation platform for landing your dream job.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold text-foreground">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/roles" className="hover:text-foreground">Roles</Link></li>
              <li><Link to="/companies" className="hover:text-foreground">Companies</Link></li>
              <li><Link to="/upload-criteria" className="hover:text-foreground">Criteria Upload</Link></li>
              <li><Link to="#" className="hover:text-foreground">Mock Interviews</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold text-foreground">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Blog</a></li>
              <li><a href="#" className="hover:text-foreground">Interview Tips</a></li>
              <li><a href="#" className="hover:text-foreground">DSA Roadmap</a></li>
              <li><a href="#" className="hover:text-foreground">Success Stories</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold text-foreground">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">About</a></li>
              <li><a href="#" className="hover:text-foreground">Contact</a></li>
              <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PrepLab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
