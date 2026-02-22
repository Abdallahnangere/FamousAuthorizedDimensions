import { Route, Switch } from 'wouter';
import Giveaway from './pages/Giveaway';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Giveaway} />
        <Route path="/sgrm" component={Dashboard} />
        <Route>404: No such page!</Route>
      </Switch>
      <Toaster position="top-center" richColors />
    </>
  );
}
