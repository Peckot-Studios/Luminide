#include <iostream>
#include <string>
#include <cstdlib>

using namespace std;

int main()
{
    cout << "检测依赖文件中..." << endl;

    if (system("test -d node_modules") != 0)
    {
        cout << "运行失败！未检测到依赖文件！" << endl;
        cout << endl;
        cout << "是否已安装 Node.js？" << endl;
        cout << "1.我已安装 Node.js，立即下载依赖" << endl;
        cout << "2.我还未安装 Node.js，立即自动安装" << endl;
        cout << "输入数字进行选择：" << endl;

        char c;
        cin >> c;
        int choice = c - '0';

        if (choice == 2)
        {
            cout << "正在自动安装 Node.js……" << endl;
            system("sudo curl -sL https://nodejs.org/dist/v18.16.0/node-v18.16.0-linux-x64.tar.xz | sudo -E bash -");
            system("sudo apt-get install -y nodejs");
            cout << "Node.js 安装完成！" << endl;
            
        }
        else if (choice != 1)
        {
            exit(1);
        }
        
        cout << "正在安装依赖……" << endl;
        system("npm i");
        cout << "依赖安装完成！" << endl;
    }
    else
    {
        cout << "检测到依赖文件！" << endl;
    }

    cout << "开始启动 Luminide..." << endl;
    system("node App.js");

    cout << "按任意键继续...";
    cin.ignore();
    cin.get();

    return 0;
}
