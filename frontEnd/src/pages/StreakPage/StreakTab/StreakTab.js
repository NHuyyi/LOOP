import styles from "./StreakTab.module.css";
import classNames from "classnames/bind";
import CalendarHeatmap from "../../../component/streak/CalendarHeatmap/CalendarHeatmap";
import Milestones from "../../../component/streak/Milestones/Milestones";

const STREAK_MILESTONES = [7, 14, 30, 60, 100];


const cx = classNames.bind(styles);

function StreakTab({ streak }) {
  return (
    <div className={cx("layout")}>
      {/* ─── Left panel: chuỗi của tôi ─── */}
      <div className={cx("panel")}>
        <div className={cx("card")}>
          <h2 className={cx("title")}>🔥 Chuỗi nhắn tin của bạn</h2>
          <p className={cx("desc")}>
            Nhắn tin mỗi ngày để duy trì chuỗi! Nếu bỏ lỡ 1 ngày, chuỗi về 0.
          </p>

          <CalendarHeatmap streak={streak} />
          <Milestones milestones={STREAK_MILESTONES} currentStreak={streak} />
        </div>
      </div>

      {/* ─── Right panel: bảng xếp hạng chuỗi ─── */}
      <div className={cx("panel")}>
        <div className={cx("card")}>
          <h2 className={cx("title")}>🏆 Bảng xếp hạng chuỗi bạn bè</h2>
          <p className={cx("desc")}>Top bạn bè có chuỗi nhắn tin cao nhất</p>

          <Podium
            entries={FRIENDS_STREAK}
            valueLabel={(e) => `${e.streak}🔥`}
          />

          <div className={cx("list")}>
            {FRIENDS_STREAK.map((friend, idx) => (
              <LeaderboardRow
                key={friend.id}
                entry={friend}
                rank={idx + 1}
                renderSub={(e) => e.lastActive}
                renderRight={(e) => (
                  <>
                    <FlameBar streak={e.streak} />
                    {e.isOnline && <span className={cx("online")} />}
                  </>
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreakTab;
