import styled from 'styled-components';

export type TimerProps = {
  remainingMS: number;
  color: string;
  running: boolean;
};

const StyledTimer = styled.div<{ isRunningLow: boolean }>`
  text-align: right;

  span {
    display: inline-block;
    background: ${(props) => (props.isRunningLow ? '#ff4444' : '#333')};
    color: #fff;
    border-radius: 8px;
    padding: 6px 8px;
    font-size: 20px;
    font-weight: bold;
    font-family: 'Courier New', monospace;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    transition: all 0.3s ease;
    min-width: 80px;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 18px;
      padding: 10px 12px;
      min-width: 70px;
    }
  }
`;

export const Timer = ({ remainingMS }: TimerProps) => {
  const time = new Date(remainingMS);
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const isRunningLow = minutes === 0 && seconds < 30;

  return (
    <StyledTimer isRunningLow={isRunningLow}>
      <span>
        {minutes}:{`0${seconds}`.substr(-2)}
      </span>
    </StyledTimer>
  );
};
