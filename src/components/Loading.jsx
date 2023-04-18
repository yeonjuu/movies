import './style.css';

export const Loading = () => {
  return (
    <div className="background">
      <span>LOADING</span>
      <img src="/loading.png" alt="데이터 로딩 중" />
    </div>
  );
};
