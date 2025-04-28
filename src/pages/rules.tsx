export const Rules = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Togyz Kumalak Game Rules
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          Game Overview
        </h2>
        <p className="mb-4 leading-relaxed">
          Togyz Kumalak is a traditional board game played between two people on
          a special board that consists of:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>2 qazandyq</strong> (scoring pots, one for each player)
          </li>
          <li>
            <strong>18 otau</strong> (holes, 9 for each player)
          </li>
          <li>
            <strong>162 qumalaqs</strong> (playing pieces)
          </li>
        </ul>

        <p className="mb-4 leading-relaxed">
          At the beginning of the game, each player owns:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>One qazandyq (scoring pot)</li>
          <li>Nine otau (holes)</li>
          <li>81 kumalaks (9 in each of their 9 otau)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Key Terms</h2>
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <dl className="space-y-3">
            <div>
              <dt className="font-bold">Qazandyq:</dt>
              <dd className="ml-4">
                A place where the player collects the kumalaks taken from the
                opponent.
              </dd>
            </div>
            <div>
              <dt className="font-bold">Otau:</dt>
              <dd className="ml-4">A hole where the kumalaks are placed.</dd>
            </div>
            <div>
              <dt className="font-bold">Tuzdyq:</dt>
              <dd className="ml-4">
                A captured opponent's otau that belongs to you for the rest of
                the game.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Game Board</h2>
        <div className="flex justify-center mb-4">
          <img
            src="assets/board.png"
            alt="Togyz Kumalak Board"
            className="max-w-full rounded-lg shadow-sm"
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Goal</h2>
        <p className="mb-4 bg-blue-50 p-3 rounded-md">
          <strong>Your objective</strong> is to collect as many of your
          opponent's kumalaks as possible in your qazandyq. You win the game if:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>You collect 82 or more kumalaks in your qazandyq, or</li>
          <li>
            All of your opponent's otau are empty or have only one kumalak each
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Game Rules</h2>
        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <p className="leading-relaxed">
              <strong>Making a Move:</strong> To make a move, select one of your
              otau. Take all kumalaks from this otau and distribute them one by
              one, moving counter-clockwise (from left to right). If you reach
              the end of your side, continue distributing to your opponent's
              otau.
            </p>
            <p className="mt-2 leading-relaxed">
              <strong>Capturing kumalaks:</strong> If your last kumalak falls
              into an opponent's otau that contains an odd number of kumalaks
              and makes it even (2, 4, 6, etc.), you capture all kumalaks from
              that otau and add them to your qazandyq.
            </p>
            <img
              src="assets/board2.png"
              alt="Togyz Kumalak Board 2"
              className="max-w-full rounded-lg shadow-sm"
            />
          </li>

          <li>
            <p className="leading-relaxed">
              When the only kumalak in an otau is distributed, that otau becomes
              empty.
            </p>
          </li>

          <li>
            <p className="leading-relaxed">
              <strong>Creating a Tuzdyq (Salt House):</strong> During the game,
              you can capture one of your opponent's otau to make it your
              tuzdyq. This is a strategic element of the game.
            </p>
          </li>

          <li>
            <p className="leading-relaxed">
              To create a tuzdyq, your last distributed kumalak must fall into
              an opponent's otau containing exactly two kumalaks (making it
              three). That otau becomes your tuzdyq, marked with "X". Any
              kumalaks that fall into this tuzdyq during subsequent moves go
              directly to your qazandyq.
            </p>
          </li>

          <li>
            <p className="leading-relaxed">
              A tuzdyq can be created only once per game and cannot be created
              in otau #9.
            </p>
          </li>

          <li>
            <p className="leading-relaxed">
              Players cannot create a tuzdyq from the opponent's otau that has
              the same position number as your opponent's tuzdyq.
            </p>
          </li>

          <li>
            <p className="leading-relaxed">
              If any player collects 82 or more kumalaks in their qazandyq, the
              game ends immediately.
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
};
