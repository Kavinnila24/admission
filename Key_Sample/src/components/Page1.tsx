import "./Page1.css";
import { useNavigate } from 'react-router-dom';

export default function Page1() {
  const navigate = useNavigate();

  return (
    <>
      <div className="card" id="id-1">
        <div className="card-header text-center">
          <h4>Login</h4>
        </div>
        <div className="card-body">
          <form>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" className="form-control" id="email" placeholder="Enter email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Login</button>
          </form>
        </div>
      </div>
    </>
  );
}