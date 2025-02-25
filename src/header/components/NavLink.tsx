import { ElementType, forwardRef } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export interface INavLinkProps {
  id?: string;
  to?: string;
  active?: boolean;

  as?: ElementType;
  onClick?: () => void;

  accessKey?: string;

  children: React.ReactNode;
}

const NavLink = forwardRef<unknown, INavLinkProps>(({ id, as, to, active, children, ...rest }: INavLinkProps, ref) => (
  <Nav.Link
      id = {id}
      as = {as ?? Link}
      to = {to ?? undefined}
      // This seems redundant, but is needed for
      // react bootstrap navbar collapseOnSelect to work.
      href = {to ?? undefined}
      active = {active}
      {...rest}
      ref = {ref}>
    {children}
  </Nav.Link>
));

export default NavLink;
