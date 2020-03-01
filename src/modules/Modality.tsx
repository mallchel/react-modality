import React, { useMemo, ReactChild, EventHandler, SyntheticEvent, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';

import './styles.css';

const ref = React.createRef<HTMLDivElement>();
let rect: DOMRect;
const getYOffsetByStep = (rate: number) => window.innerHeight - window.innerHeight * rate;

type ModalityType = {
    children?: ReactChild;
    visible?: boolean;
    steps?: number[];
    horOffsets?: string[];
    onClose: EventHandler<SyntheticEvent>;
};
export const Modality = ({
    children,
    visible,
    steps = [0.2, 0.4, 0.95],
    horOffsets = ['20px', '15px', '5px'],
    onClose,
}: ModalityType) => {
    let stopClickPropagation = false;
    const initialOffset = useMemo(() => getYOffsetByStep(steps[0]), [steps]);
    const initialPositionConfig = useMemo(() => ({ y: initialOffset, left: horOffsets[0], right: horOffsets[0] }), [
        horOffsets,
        initialOffset,
    ]);
    const [{ y, left, right }, set] = useSpring(() => ({
        ...initialPositionConfig,
        config: { tension: 500, friction: 36 },
    }));

    useEffect(() => {
        if (!visible) {
            set(initialPositionConfig);
        }
    }, [visible, initialPositionConfig, set]);

    const bind = useDrag(({ down, movement: [, y] }) => {
        stopClickPropagation = true;
        if ((down && !rect) || (!down && !rect)) {
            rect = (ref.current as HTMLElement).getBoundingClientRect();
        }

        const nextY = rect.y + y;

        if (down) {
            set({ y: nextY < 0 ? 0 : nextY });
        } else {
            // clear
            rect = (null as any) as DOMRect;

            let matchClosestStepIndex = 0;
            steps.forEach((_, currentIndex) => {
                if (currentIndex === 0) {
                    return;
                }

                const distanceToClosestStep = Math.abs(
                    getYOffsetByStep(steps[matchClosestStepIndex]) - nextY
                );
                const distanceToCurrent = Math.abs(getYOffsetByStep(steps[currentIndex]) - nextY);

                if (distanceToCurrent < distanceToClosestStep) {
                    matchClosestStepIndex = currentIndex;
                }
            });

            set({
                y: getYOffsetByStep(steps[matchClosestStepIndex]),
                left: horOffsets[matchClosestStepIndex],
                right: horOffsets[matchClosestStepIndex],
            });
        }
    });

    return visible
        ? ReactDOM.createPortal(
              <div
                  className="react-modality-mask"
                  onClick={e => {
                      if (stopClickPropagation) {
                          e.stopPropagation();
                          stopClickPropagation = false;
                          return;
                      }

                      onClose(e);
                  }}
              >
                  <animated.div
                      className="react-modality-content"
                      ref={ref}
                      {...bind()}
                      style={{
                          top: y,
                          left,
                          right,
                      }}
                  >
                      {children}
                  </animated.div>
              </div>,
              document.body
          )
        : null;
};

Modality.propTypes = {
    children: PropTypes.node,
    visible: PropTypes.bool,
    steps: PropTypes.arrayOf(PropTypes.number),
    horOffsets: PropTypes.array,
    onClose: PropTypes.func,
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};
