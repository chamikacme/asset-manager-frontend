const Logo = ({ size }: { size?: string }) => {
  return (
    <div className={"font-sans" + (size ? ` ${size}` : " text-3xl")}>
      <span className="text-primary font-extrabold">Asset</span>
      <span>Manager</span>
    </div>
  );
};

export default Logo;
