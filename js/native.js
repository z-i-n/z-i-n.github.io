/**
 * Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * 네이티브에서 웹으로 전달되는 이벤트를 관리하는 객체
 * addListener를 이용하여 이벤트와 callback function을 등록한다.
 */
var nativeEvent = new CustomEvent();

var nativeInterface = new function () {
	/**
	 * Event notification from native application
	 * evt는 이벤트이며, args는 JSON Object 또는 단순 String 이다.
	 */

	/*
	 * Event 값
	 * var EventType 참조.
	 */
	/*
	 * 이벤트로 전달되는 URL.
	 * - OfflineData인 경우는 서버 API의 URI 참조
	 * - ButtonClick은 "Right" or "Left"로 단순히 어떠한 버튼이 눌렸는지만 전달
	 * - NetworkStatus는 "true" or "false"의 상태 값
	 */

	/*
	 * 이벤트로 전달되는 args.
	 * - OfflineData인 경우는 서버 API의 JSON object 참조
	 * - ButtonClick은 없음
	 * - NetworkStatus는 없음
	 * - GetImage는 로컬 URL과 서버 URL
	 */
	this.applicationNotifications = function () {
		console.log('jsListener : command [' + arguments[0] + '] param(or json) = ' + arguments[1]);
		nativeEvent.fireEvent.apply(nativeEvent, arguments);
	}

	this.execute = function (command, param) {
        try{
            console.log('nativeListener.execute : command [' + command + '] param(or json) = ' + param );
            window.nativeListener.execute(command, param);
        } catch(err) {
            console.log('nativeListener is not defined');
        }
	}
}
window.jsListener = nativeInterface.applicationNotifications;

